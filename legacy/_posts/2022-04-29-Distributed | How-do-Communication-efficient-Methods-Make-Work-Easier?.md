---
title:  "Distributed | How do Communication-efficient Methods Make Work Easier?"
subtitle: "A Practical Guide for Accelerating Distributed Training"
mathjax: true
layout: post
author: Chih-Yu, Chen, Xinbei
categories: media
---  
As you have found the post in the ocean of webpages, I guess you are looking for some methods to accelerate the training of deep neural network models to avoid a long wait which may take several hours or even several days. The post aims at providing an introduction to the main ideas of distributed training and a practical guide for practitioners and students who have had some prior experiences in training DNN models and are knocking the door of distributed training with the hope of shortening the training duration. We hope the post could help them grasp the main ideas of distributed training, be aware of the problems which the researchers are striving to address, and most importantly, start the first distributed training task as a freshmen based on some popular frameworks and try some performance-optimisation methods.
As the title of the post suggests, we would demonstrate how a communication-efficient method makes our training work easier, during which we would answer three progressive questions to address the main question.   
1) __WHY__ does distributed method work in accelerating model training?    
2) __HOW__ do communication-efficient methods address the problem in distributed training?     
3) __WHAT__ is the actual performance of communication-efficient methods in a working environment?
## WHY does the distributed method work?
Benjamin Franklin said, "Time is money". Since training a model - which may take a day or a week - is so expensive in time, why don't we use cheaper resources instead, such as using more commodity computers rather than one? The idea seems in the same spirit of the proverb, “two heads are better than one”. It sounds intuitive and reasonable, but it is not necessarily true, that is, using more computers does not necessarily speed up training. Some jobs, by their nature, are so dependent on individual performance that increasing the number of jobs does not increase efficiency. For example, it takes four hours for a car to run 1,000 miles at 250 mph, and we cannot expect that running 4 of the same cars together will reduce the time to one hour. If you want to trade quantity for time, this requires that the tasks to be performed can be carried out at the same time. That's why we want to answer this question in the first place.
<p align="center">
<img src="../image/Communication-Efficient-Methods/image01.png" width="400" height="200"/>
</p>
At first glance, the task of training a neural network does not seem like a task that can be operated in parallel, because each gradient update depends on the completion of the previous calculation, and each iteration is completed sequentially. That being the case, __why is it useful to train neural network models with distributed architecture?__ 

<p align="center">
<img src="../image/Communication-Efficient-Methods/image02.png" width="400" height="200"/>
</p>

 The reason is that algorithms for computing gradients in the DNN model—__stochastic gradient descent (SGD)__—can work in parallel. The SGD algorithm uses a fixed-size batch of samples to calculate the gradient each time. Although it can effectively avoid tensive computation when applying the gradient descent algorithm to processes large dataset, SGD algorithm also brings some problems. For example, due to a small number of samples to feed into the DNN model for computing the gradient, the performance of SGD can be greatly influenced by each individual, and the result will be interfered by massive noise, leading to a state which is noisier and more stochastic than gradient descent, and is less likely to point to the global steepest direction. As a consequence, convergence speed would be affected. The data-parallelism distributed strategy is equivalent to multiplying the number of training samples in the same time period, which is approximately equal to a computer using a larger batch, so that the gradient would be more robust and more likely to point to the global steepest direction, thereby speeding up the convergence. It is shown that the steps required to complete an epoch (that is, to traverse all the data) become $$ \frac{1}{n} $$ times of that in the case of a single computer, because there are n machines working simultaneously. The number of datapoints that can be used in one step is $$ n\times $$ batch size. It should be noted that the time to complete an epoch reducing to that in a single computer case only exists in an ideal environment, and also this does not mean the time taken to achieve the same accuracy rate will be shortened in the same scale. In general, increasing the number of computers could speed the training up.
 
 <p align="center">
<img src="../image/Communication-Efficient-Methods/image03.png" width="400" height="200"/>
</p>
 
So far, we have answered the most basic question, why distributed training can improve training speed. The answer is __distributed training increases the size of the batch to calculate the gradient at the same time, thus making the gradient more robust and speeding up the convergence.__

<p align="center">
<img src="../image/Communication-Efficient-Methods/image04.png" width="400" height="200"/>
</p>
 
### Communication as a Bottleneck in Distributed Training
Since distributed training can theoretically improve the training speed, can we greatly increase the training speed by simply increasing the number of computers? In an ideal environment, the speed of completing an epoch increases linearly with the number of computers, and the time to reach the same accuracy also decreases. It should be noted that this is only the case in an ideal environment. In the real human world, the training cannot be scaled up linearly. __Communication__ is a major component that prevents distributed training from linear scale-out (Zhen). Researchers like to call it __communication bottleneck__. According to Bergman et al. (2008), when the number of processors is very large, the time spent on computer communication can even exceed 50%. What a huge expense!

<p align="center">
<img src="../image/Communication-Efficient-Methods/image05.png" width="400" height="200"/>
</p>
<p align="center">
<em>Figure: Communication in Parameter Server</em>
 </p>
 
 The figure above shows the distributed computing architecture of Parameter Server. We clearly see the part where the computers communicate with each other in this diagram. It would not matter a lot if the content of the communication is not much. Once there is a lot of data, the transmission will become a significant factor blocking the efficiency of distributed computing. We can imagine that in Tensorflow, the default format of parameters is float32, which means that a parameter needs 32 bits to store. If a model, such as ResNet or VGGNet, has tens of millions of parameters without being compressed, each piece of transmitted information would be in a size of tens of GB, which will be a big burden for the network.
Now that communication overhead is a key factor which blocks the linear scale-up, then how shall we tackle it? This is the second question of the post: __how do communication-efficient methods address the problem in distributed training?__
## HOW to address communication bottlenecks?
Communication-efficient methods, as indicated by its name, are proposed for making the communication more efficient in distributed training. According to Tang et al’ (2020) typology, we can summarise these methods into four dimensions: when to communicate, whom to communicate, what to communicate and how to communicate. They made the table below. In this post, we are going to introduce the first three, because they predominate popular methods.


<p align="center">
<img src="../image/Communication-Efficient-Methods/image06.png" width="400" height="300"/>
</p>
<p align="center">
<em>Table: Taxonomy of Distributed SGD (Tang et al, 2020)</em>
 </p>

### Synchronisation — When to communicate?
It is very intuitive to think about approaches to improve communication efficiency in the perspective of communication frequency. If the frequency of communication between machines is low, distributed training will naturally spend less time on communication. However, it is not difficult to imagine that the low frequency of communication would lead to some loss in information, which would make it take more iterations to get the same accuracy. To decrease the communication between computing machines is actually doing a tradeoff between training time and accuracy. In terms of the methods of communication synchronisation there are four basic options depending on how many workers and how often each worker interacts with the other workers: synchronous, stale-synchronous (SSP), asynchronous (ASP), and local SGD.<br>
__Synchronisation__ is a common method of communications synchronisation, but the communication time is usually the longest. The machine uploads the gradient/model parameter values after each iteration, and uses the average of the gradient/model parameter values to obtain the parameters of the next iteration. Since the completion of each communication requires all machines in the cluster to complete the calculation, the training performance of the entire cluster would be largely affected by the stragglers.<br>
__Stale synchronisation__ relaxes the restrictions of the synchronisation method. It no longer requires all machines to complete the calculation to execute the next step, but only requires the gradients of any n machines to be uploaded before updating the global model.Stragglers in the cluster are ignored. In this case, the faster machine can do more iterations before synchronising the parameters. However, in order to ensure the consistency and convergence (Ho et al., 2013), the number of steps between the fastest and the slowest needs to be limited within a certain range.<br>
The __asynchronous method__ further relaxes restrictions of the stale synchronisation method. As stated above, a huge gap in iteration steps between the fastest and the slowest may cause issues in model consistency and convergence. In the asynchronous method, the considerations of consistency and convergence are put aside, and there is no longer a limit to the gap in the iteration between machines. Each machine uploads the gradient value to the parameter server to update the global model after each round of calculation.As a consequence, the method may suffer from consistency and model convergence problems in some models and datasets (Ho et al., 2013), although it is very effective in overcoming the bucket effect.<br>
__Local SGD__, in its essence, is a generalised synchronisation method. The number of iterations before the model update is no longer 1 as is required in the synchronisation method, but n, that is, after all machines complete n iterations locally, then upload parameters, average and update the model. In the spectrum of Local SGD, the synchronisation method is actually a special case of it when n=1. Although this method would still face the inefficiency brought by stragglers, it reduces the communication time by reducing the communication frequency. However, compared with the special case of N=1, the local synchronisation method requires more iterations to achieve the same accuracy. Therefore, the number of iterations needs to be carefully selected in practice to balance the training time and the accuracy.<br>
### System Structure — Whom to Communicate？
 The system architecture describes how workers exchange information and how they average parameters across distributed workers. By changing the architecture, the communication bottleneck can also be alleviated. Meanwhile, compared with changing communication synchronisation, changing system architecture usually is lossless because they do not try to change the results of the training. Parameter Server (PS), All-reduce and Gossip are the most popular architectures.

<p align="center">
<img src="../image/Communication-Efficient-Methods/image07.png" width="600" height="300"/>
</p>
<p align="center">
<em>Figure: System Architectures</em>
 </p>

__Parameter Server__ is a usual architecture when using deep learning. The system includes a central server that can collect worker information, update the global models, and send the updated model back to workers. The architecture is simple and flexible, but since each worker needs to communicate with the server, it is easy for the server to be a bottleneck.<br>
The __All-Reduce__ architecture can alleviate some of the communication bottleneck in the PS, since there is no central server in this architecture. All workers exchange information directly, rather than via a server, and update the model individually. Due to the need for communication among all workers, this structure may not yield the best results when the number of workers is high. The model of the workers must be updated with the information of each worker, which is against the features of asynchronous communication, so that all-reduction is difficult to achieve with ASP.<br>
The __Gossip__ architecture is also devoid of parameter servers. In addition, unlike the all-reduce architecture, the Gossip architecture updates models based on information from neighbour workers instead of all workers, so that communication is considerably reduced. Consistency of parameters across all workers is not guaranteed by the algorithm, but it is guaranteed at the end of the algorithm. This means that during every iteration, each local model is different.<br>
### Compression Techniques — What to Communicate？
Reducing the size of the information is also a way to reduce communication time. The compression methods operate along these lines. To reduce communication data size, workers and servers consider compressing information that needs to be transmitted. In most cases, compression methods are lossy, which means the original information may not be recovered completely. The convergence may suffer as a result. A crucial part of these methods is how to retain as much information as possible with the smallest possible file size. Quantization and sparsification are the two main compression techniques.<br>
The __quantization__ method attempts to represent the data with lower bits that are originally represented with 32 bits on every dimension. Typically, quantization is realised by limited-bit, which maps each element to fewer bits, or codebook-based, which projects gradient coordinates into predefined code words. However, regardless of the method used, the precision of gradients is relatively low after the quantized communication, so quantization is relevant to deep learning with low precision. It is practicable to implement quantized communication if the gradients' precision is low enough to guarantee convergence.<br>
__Sparsification__ selects a small number of gradients to be updated at each iteration, reducing the number of elements transmitted during each analysis. It seeks to only keep vital gradients to guarantee the convergence of the model parameter, and can usually be classified as two types: one is a fixed number of elements selected, while the other changes the number of components as the learning progresses. Gradient sparsification reduces communication traffic more aggressively than quantization usually.<br>
So far, we have introduced the main ideas of methods addressing communication bottlenecks in distributed training. Researchers are diligently trying to come up with new methods to solve the problem repeatedly mentioned above. The constant emergence of new methods is exciting, but this does not mean that the performance of all methods could bring a surprise in the practice of distributed training. In the following section, we will get our hands dirty implementing some of the methods aforementioned in the working environment of distributed training, examine and compare the performance of these methods.<br>
## WHAT is the performance of communication-efficient methods?
### Preparations
#### Tools — TensorFlow & Horovod
TensorFlow is one of the most popular deep learning platforms. It is an open-source platform with end-to-end capabilities for machine learning that comprises a comprehensive ecosystem of tools, libraries, and so on that can be leveraged to build and deploy ML-powered applications easily. Some distributed training strategies have been implemented in TensorFlow, which makes the distributed training very easy with it. In this post, we will use TensorFlow not only as the library for building DNN models, but also as a tool for distributed training. <br>
 Apart from TensorFlow, we will use Horovod as well. Horovod is a popular framework for distributed training with TensorFlow, Kera, Pytorch and Apache MXNet. Several state-of-the-art distributed communication libraries are supported (e.g., MPI, NCCL, and Gloo) and can be used for algorithms with all-reduce architectures. It is designed to make distributed deep learning fast and easy to use and take a single-worker training script and successfully scale it to train many workers in parallel. The most important reason we use Horovod is that we can easily customise compression techniques and incorporate them into the training process. <br>
#### Dataset & Model — Cifar 10 & ReseNet
In this post, we use the CIFAR-10 dataset to train with a ResNet model for an image classification task. The CIFAR-10 dataset consists of 60000 32x32 colour images in mutually exclusive 10 classes, with 6000 images per class, and the total size for this dataset is 163 MB.<br>
Residual neural network (ResNet) is widely used in papers of communication-efficient methods for evaluating the performance. Therefore we employ it in this post. The ResNet model used here has 44 layers with more than 660,000 parameters.<br>
### Comparison
We have made some comparison between different settings of distributed computing. We implement all our work on Google Cloud Platform. As there is a limit in IP address quota, we can at most use 4 IP addresses one at a time. Therefore, we take the performance of 3 worker nodes as the baseline. We will use a 3-worker-node cluster to compare different settings.  Although the GPU could perform better in training DNN models, we use CPU only in this comparison task due to the quota constraint on GCP.
#### Horovod V.S. TensorFlow
As both Horovod and TensorFlow support the All-Reduce strategy, we make a comparison between these two platforms in distributed training. Horovod supports All-Reduce strategy only while TensorFlow supports some more strategies other than All-Reduce, such as Parameter Server and Central Storage. 


<p align="center">
<img src="../image/Communication-Efficient-Methods/image08.png" width="400" height="200"/>
</p>
<p align="center">
<em>Figure: Performance Comparison: Horovod vs. TensorFlow</em>
 </p>

As we can see in the chart above, TensorFlow performs much better than horovod in this task. When setting the accuracy to be 0.85, Tensorflow saves around 23 minutes. It can be expected that the gap between the two platforms would even expand when setting a higher accuracy rate. Although these two platforms both take All Reduce strategy, some technical details may still differ. Perhaps TensorFlow has some optimizations in doing distributed training with the All-Reduce strategy.  
#### Number of Worker Node
We compare the performance of training with 1,3 and 4 worker nodes. In terms of the time of completing each epoch, they are not scaled up linearly when adding more worker nodes to the cluster. Communication and aggregation may slow down the processing step. When it comes to the accuracy, a 4-worker-node cluster speeds up 1.7 times faster than a single node with the accuracy setting at 0.85. In this case, a 4 worker-node cluster helps to save around half an hour. 

<p align="center">
<img src="../image/Communication-Efficient-Methods/image09.png" width="200" height="150"/>
<img src="../image/Communication-Efficient-Methods/image10.png" width="400" height="200"/>
</p>
<p align="center">
<em>Table, Figure: Time Per Epoch (a), Performance Comparison: Different Number of Worker Nodes</em>
</p>
 
#### Number of Step Per Pass
There is a hyperparameter in Horovod distributed optimiser that can be used to control the number of local iterations before updating parameters. When the number is set to be 1, this is a classic synchronous method, and it is a Local SGD otherwise. It is apparent in the graph below that local SGD does not perform well in this task, as there is a huge gap between the training times of the one adopting the classic synchronous method and those adopting Local SGD. The performance of distributed training suffers greatly due to the information loss brought by Local SGD. Although the average processing time for each iteration decreases as the number of local steps increases, it is not worthwhile to make such a great compromise on accuracy in exchange for a minor saving in training time.

<p align="center">
<img src="../image/Communication-Efficient-Methods/image11.png" width="200" height="150"/>
 <img src="../image/Communication-Efficient-Methods/image10.png" width="400" height="200"/>
 </p>
 <p align="center">
<em>Table, Figure: Time Per Epoch (b), Performance Comparison: Different Number of Local Iteration Steps</em>
 </p>

Compression Techniques
According to the table and graph above, we can see that none of compression techniques outperform the one without compression technique. The closest one to that without compression is FP16, which simply compresses the float32 data into float16 data. Some compression techniques make the time for each iteration much shorter than the baseline, such as Random-K and Top-K. However, the time saving in each iteration did not compensate for the information loss of compression, thus largely affecting the convergence of the model. We can also find that some compression techniques even make the time for each iteration longer, which may be because the execution for compressing and decompressing takes much time. It is quite weird that Top-K with a compression ratio of 0.4 even spends less time than that with compression ratio of 0.2. The latter keeps less nonzero elements which is expected to convey less information and thus making each step faster to execute. The graph shows that, at least in this task, compression techniques are unnecessary in accelerating training. 
  
 <p align="center">
<img src="../image/Communication-Efficient-Methods/image13.png" width="200" height="150"/>
<img src="../image/Communication-Efficient-Methods/image12.png" width="400" height="200"/>
 </p>
 <p align="center">
<em>Table, Figure: Time Per Epoch (c), Performance Comparison: Different Compression Techniques</em>
 </p>

From the comparisons above, we can state the conclusion briefly in two sentences: Increasing the number of worker nodes can significantly improve the training speed. Communication-efficient methods are not useful at all in this case.<br>
We can also state the conclusions with more sentences: <br>
- Increasing the number of worker nodes can significantly improve the training speed. The higher the accuracy requirement is, the more time saved for training by adding nodes. 
- When the number of working nodes and model parameters is not particularly large, some high-efficiency communication methods are not effective, and the gain brought by the information lossy algorithm in terms of speed improvement is far from making up for the loss of information in terms of accuracy loss. 
- The time loss of compression and decompression caused by complex compression techniques is sometimes difficult to ignore, which will affect the final training time.<br>
## Suggestions
As you can see the experiment results above, none of the information-lossy methods has a good performance in our task. Therefore, we would give suggestions as follow to practitioners who are to start a DNN-model-training task in which the number of computers in the cluster is not so large, say no more than 8, and the model is not so big, say with parameters less than 1,000,000:<br>
-	Distributed strategies provided by TensorFlow are highly recommended, especially the “MultiWorkerMirroredStrategy” as they might have been optimized.
-	If you’d like to use Horovod to do distributed training task, be very cautious when considering using information-lossy methods, such as local SGD and compression techniques. Because in your case, overhead of communication is not likely to be a big problem and the saving in time for each iteration is not likely to compensate for the loss of accuracy.<br>
## GUIDEBOOK    
In this [notebook](../LinkFiles/Communi/Distributed%20Training%20Guidebook%20with%20Horovod%20and%20TensorFlow.ipynb), we provide detailed instructions for configuring a distributed training environment with TensorFlow and Horovod on Google Cloud Platform. Why not to have a look now?

#### References
[1] Betzel, F., Khatamifard, K., Suresh, H., Lilja, D., Sartori, J. and Karpuzcu, U., 2019. Approximate Communication. ACM Computing Surveys, 51(1), pp.1-32.<br>
[2] D. Alistarh, D. Grubic, J. Li, R. Tomioka, and M. Vojnovic, 2017. QSGD: Communication-Efficient SGD via Gradient Quantization and Encoding. Advances in Neural   Information Processing Systems, 2017 vol. 30.<br>
[3] Ho, Q., Cipar, J., Cui, H., Kim, J. K., Lee, S., Gibbons, P. B., Gibson, G. A., Ganger, G. R., and Xing, E. P., 2013. More Effective Distributed ML via a Stale Synchronous Parallel Parameter Server. Advances in neural information processing systems, 2013, 1223–1231.<br>
[4] J. Jiang, F. Fu, T. Yang, and B. Cui, 2018. SketchML: Accelerating Distributed Machine Learning with Data Sketches. Proceedings of the 2018 InternationalConference on Management of Data, New York, NY, USA, pp. 1269–1284.<br>
[5] Lian, X., Huang, Y., Li, Y. and Liu, J., 2015, Asynchronous parallel stochastic gradient for nonconvex optimization, Proceedings of the 28th International Conference on Neural Information Processing Systems - Volume 2, ser. NIPS15. Cambridge, MA, USA: MIT Press, p. 27372745. <br>
[6] Loshin, D. Business Intelligence : The Savvy Manager's Guide. 2nd ed. 2012. The Morgan Kaufmann Ser. on Business Intelligence Ser. Web.<br>
[7] Shi, S., Tang, Z., Chu, X., Liu, C., Wang, W. and Li, B., 2021. A Quantitative Survey of Communication Optimizations in Distributed Deep Learning. IEEE Network, 35(3), pp.230-237.<br>
[8] Tang, Z., Shi, S., Chu, X., Wang, W., & Li, B., 2020. Communication-efficient distributed deep learning: A comprehensive survey. arXiv preprint arXiv:2003.06307.<br>
[9] S. U. Stich, J.-B. Cordonnier, and M. Jaggi, 2018. Sparsified SGD with memory, Advances in Neural Information Processing Systems, vol. 31.<br>
[10] Yan, Z. and Shao, Y., 2015. Asynchronous Distributed Data Parallelism for Machine Learning. [online] LearningSys. Available at: 
<http://learningsys.org/papers/LearningSys_2015_paper_14.pdf><br>

__Authors:__ Chih-Yu, Chen, Xinbei <br> 
