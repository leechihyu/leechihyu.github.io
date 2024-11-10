---
title:  "Numerical & GLM | Iteratively Reweighted Least Square"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

#### 目前的版本相当于一个草稿，非常随性。因为Chih-Yu在准备考试，所以有待日后完善。。。

在复习广义线性模型的时候，我总是被估计参数的数值方法弄晕。我学到了三种计算估计值的方法：牛顿法、费雪得分法、迭代重加权最小二乘法。<br>
我被它们弄晕的主要原因就是在形成这些方法的过程中，一些作者喜欢在引入一些新的表示的时候不同时说明背后的缘由，导致我很难理解这些表示，看着这些表示心里就像有人在给我挠痒痒，总是不得劲儿。牛顿法和费雪得分法其实在思路上一点都不难，迭代重加权最小二乘法这个东西在中文世界里面介绍的不多。其实这个方法我一直都挺困惑的，困惑的点在于：为什么需要这个方法？这个方法好在哪里？这个方法的思路是什么？我发现不管是在课上还是在我阅读的书里面，对着几个问题的解答都不够，甚至就没有回答这几个问题，这使我非常懊恼。<br>
本篇博文的主要目的就在于用一种简单明了的方法介绍这几种方法。这个过程对我自己来说也是一个学习的过程，下面我们就开始吧。<br>

### 牛顿法 Newton-Raphson Method
牛顿法的思路的最原点是`泰勒展开(Taylor's Expansion)`。我们知道，泰勒展开在很多地方被用于近似某个函数，在就牛顿法里面，它的作用也是如此。我们有一个对数似然函数 $$l(\theta)$$，在极大似然估计中我们常把它成为得分函数(score function)$$s(\theta)$$。接下来就是见证泰勒展开魔力的时候了：<br>
$$s(\theta)\approx{s(\theta_{0})+\frac{\partial}{\partial\theta}s(\theta_{0})(\theta-\theta_{0})}$$。<br>
由于取到最优解的时候$$s(\theta)=0$$，所以我们让$$s(\theta_{0})+\frac{\partial}{\partial\theta}s(\theta_{0})(\theta-\theta_{0})=0$$。重新整理一下我们可以得到 <br>
$$\theta = \theta_{0}-[\frac{\partial}{\partial\theta}s(\theta)]^{-1}s(\theta_{0})$$。<br>
因为 $$I(\theta)=-\frac{\partial}{\partial\theta}s(\theta_{0})$$，所以原方程可以表示为 $$\theta = \theta_{0}+I(\theta)^{-1}s(\theta_{0})$$。这个式子在计算的过程中就表示为<br>
$$\theta^{m+1} = \theta^{m}+I(\theta^{m})^{-1}s(\theta^{m})$$。
到这一步所有事情都变得清爽了起来，显然我们下一步要做的就是找到计算 $$I(\theta^{m})$$ 和 $$s(\theta^{m})$$ 的式子。<br>
$$s(\theta)$$ 相对来说比较好算。<br>
$$s(\theta)=\frac{\partial}{\partial \theta}l(\theta)$$，<br>
其中 $$l(\theta)=log{f(x)}$$。<br>
因为我们在广义线性模型的题目下讨论牛顿法，而广义线性模型里面的许多模型分布都属于两参数的指数分布(two-parameter exponential family)，可以写成如下形式：<br>
$$f(y;\theta)=exp\{\frac{\theta y-b(\theta)}{\phi}+c(y;\phi)\}$$。<br>
$$l(\theta) = \frac{\theta y-b(\theta)}{\phi}+c(y;\phi)$$。<br>
我们首要关注的参数是 $$\beta$$，所以我们要求 $$\frac{\partial l(\theta)}{\partial \beta}$$。因为 $$\frac{\partial l(\theta)}{\partial \beta}$$ 不好直接算，所以我们采用链式法则(chain rule) <br>\
$$\frac{\partial l(\theta)}{\partial \beta}=\frac{\partial l(\theta)}{\partial \theta}\frac{\partial \theta}{\partial \mu}\frac{\partial \mu}{\partial \eta}\frac{\partial \eta}{\partial \beta}$$。<br>
$$\frac{\partial l(\theta)}{\partial \theta}=\frac{y-b^{'}(\theta)}{\phi}$$，<br>\
其中 $$b^{'}(\theta)=\mu$$，$$\phi$$是一个定值，这样第一项就非常好算了。<br>
$$\frac{\partial \theta}{\partial \mu}=[\frac{\partial \mu}{\partial \theta}]^{-1}=b^{''}(\theta)^{-1}=\frac{\phi}{Var(y)}$$ 。<br>
最后一项非常简单，就是 $$x$$。<br>
我们来关注第三项，第三项也许是变数最大的一项，因为这里涉及link function的问题。如果采用的是canonical link，情况会变得非常简单，因为Link function直接将 $$\mu$$转化为自然参数natural parameter，也就是 $$\theta=g(\mu)=\eta=X\beta$$。$$\frac{\partial l(\theta)}{\partial \beta}=\frac{\partial l(\theta)}{\partial \theta}\frac{\partial \eta}{\partial \beta}=\sum\frac{y- \mu}{\phi}x=\frac{1}{\phi}\sum(y-\mu)x$$。<br>
如果不是canonical link情况就会稍微复杂一些，我们之前算了除第三项以外的三项，现在关注第三项。<br>
$$\frac{\partial \mu}{\partial \eta}=[\frac{g(\mu)}{\partial \mu}]^{-1}$$，因为 $$g(\mu)=\eta=X\beta$$嘛。这样第三项就算完了，把所有的项放在一块，<br>
$$s(\theta)=\sum\frac{(y-\mu)}{Var(y)}[\frac{g(\mu)}{\mu}]^{-1}x$$。$$I(\theta)=-\frac{\partial}{\partial \beta}s(\theta)=-\sum\{[\frac{y-\mu}{Var(y)}]^{'}[\frac{g(\mu)}{\mu}]^{-1}x+[\frac{y-\mu}{Var(y)}][(\frac{g(\mu)}{\mu})^{-1}x]^{'}\}$$。<br>
这样，我们就给出了 $$s(\theta)$$ 和 $$I(\theta)$$ 表达式。<br>
回到最开始牛顿法的迭代公式，$$\theta^{m+1} = \theta^{m}+I(\theta^{m})^{-1}s(\theta^{m})$$。将我们上面求得的两个表达式带进去就可以了。   
我们仔细观察牛顿法的迭代公式，我们也许可以产生一种联想，可以将其与梯度下降法联系起来（如果你熟悉梯度下降的话）。之所以我想将牛顿法与梯度下降法联系起来，是因为我觉得梯度下降法提供了一种很形象的图景，目标函数不断沿着梯度向下走，直到走到谷底。 $$s(\theta)$$ 不就是对数似然函数的一阶导数，得到的东西不就是梯度嘛？而前面的 $$[I(\theta)]^{-1}$$ 可以看作是梯度前面的步长。两者的区别在于，牛顿法里面的步长相较于梯度下降法比较难求。   
下面介绍的费雪得分法实质上和牛顿法差不多，区别在于费雪得分法选了一个更好求的步长。   

### 费雪得分法
费雪得分法里面，$$s(\theta)$$ 前面的那个东东不再是 $$[-\frac{\partial}{\partial \beta}s(\theta)]^{-1}$$，而是它的期望 $$[E(-\frac{\partial}{\partial \beta}s(\theta))]^{-1}$$,也就是费雪信息矩阵的期望 $$E(I(\theta))^{-1}$$。对指数族的里的函数求费雪信息矩阵的期望有一个好处，如果你观察上面得到的式子的话,<br>
  $$I(\theta)=-\frac{\partial}{\partial \beta}s(\theta)=-\sum\{[\frac{y-\mu}{Var(y)}]^{'}[\frac{g(\mu)}{\mu}]^{-1}x+[\frac{y-\mu}{Var(y)}][(\frac{g(\mu)}{\mu})^{-1}x]^{'}\}$$，<br>
 求期望以后，第二项就没了，因为 $$E(y-\mu)=0$$。我们只要算第一项就可以了，第一项里面主要算的就是 $$\frac{\partial \mu}{\partial \beta}$$，这项又可以变为 $$\frac{\partial \mu}{\partial \beta}=\frac{\partial \mu}{\partial \eta}\frac{\partial \eta}{\partial \beta}=[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x$$。因为我们只需要算一项的导数，并且代数字进去计算，所以费雪得分法要简单一些，而且在一些情况下计算效率也高，这里的计算效率指的是收敛率。
最后我们整理一下费雪得分法的式子：<br>
$$I(\theta)=\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x^2}{Var(y)}$$。<br>
$$\theta^{m+1} = \theta^{m}+I(\theta^{m})^{-1}s(\theta^{m})$$ <br>
其中：<br>
$$s(\theta)=\sum\frac{(y-\mu)}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x$$ <br>
$$I(\theta)=\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x^2}{Var(y)}$$。<br>

### 迭代重加权最小二乘法
说实话，我真的是get不到这个方法的点。据说是因为20世纪计算机技术还不发达的时候，统计学家们发明了一种可以做加权最小二乘法的算法，所以就改一改费雪得分法让它可以通过加权最小二乘法的算法进行计算。（好无语哦）我暂时还不太清楚这个方法在计算效率上会不有有什么优势，感觉它就是费雪得分法的变形嘛。<br>
费雪得分法的算式：<br>
$$\theta^{m+1}=\theta^{m}+[\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x^2}{Var(y)}]^{-1}\sum\frac{(y-\mu)}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x$$，<br>
两边同时乘上 $$I(\theta)$$，就得到:<br>
$$I(\theta)\theta^{m+1}=[\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x^2}{Var(y)}]\theta^{m}+\sum\frac{(y-\mu)}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x$$。<br>
因为 $$\eta^{m}=x\theta^{m}$$，所以<br>
$$I(\theta)\theta^{m+1}=[\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x}{Var(y)}]\eta^{m}+\sum\frac{(y-\mu)}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x$$。<br>
右边我们可以提一个公因式 $$[\sum \frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x}{Var(y)}]\eta^{m}+\sum\frac{(y-\mu)}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-1}x=\sum\{[\frac{[\frac{\partial g(\mu)}{\partial \mu}]^{-2}x}{Var(y)}][\eta^{m}+(\frac{\partial g(\mu)}{\partial \mu})(y-\mu)]\}$$，<br>
这之后，两边同时乘上 $$I(\theta)^{-1}$$，写成向量的形式就是
$$\theta^{m+1}=X^{-1}z^{m}$$。<br>
注意哦，这样写通常是_有问题_的，因为 $$X$$通常是奇异矩阵singular matrix，这非常好理解，通常情况下 $$X$$的形状是 $$R^{n\times p}$$，$$n \neq p$$。所以我们要借助一个东西来帮助它成为非奇异矩阵。式子最后可以写成：<br>
$$\theta^{m+1}=(X^{T}W^{m}X)^{-1}(X^{T}W^{m}z^{m})$$ <br>
其中 $$W^{m}=\frac{1}{Var(y)}[\frac{\partial g(\mu)}{\partial \mu}]^{-2}$$，<br>
$$z^{m}=\eta^{m}+\frac{\partial g(\mu)}{\partial \mu}(y-\mu)$$。<br>
$$W^{m}$$ 很好理解嘛，这个就是提取了 $$I(\theta)$$ 除了 $$x^{2}$$ 的部分出来，$$z^{m}$$ 就是提取完公因式后右边剩下的部分。
我对迭代重加权最小二乘法的理解还不够深入。目前对它充满了偏见，认为它就是一个历史遗留之物，为了当时计算机的实现而放弃了思路上的简洁性。费雪得分法思路多清楚啊，为什么非要弄一个RWLS来继续折腾呢？目前我还没有研究过RWLS在当代的优势，如果它计算效率更高，收敛速度更快我也认了。不过要提一句的是，这个方法似乎是目前市面上主流计算软件在做广义线性模型时采用的方法。





