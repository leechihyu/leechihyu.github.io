---
title: "Multivariate | Multivariate Methods as Extensions of Generalised Linear Model"
author: "Chih-Yu"
mathjax: true
layout: post
categories: media
---

### Multivariate Methods as Extensions of Generalised Linear Model

In this post, I am attempting to introduce multivariate methods in an unified framework, in which those methods are regarded as extensions of generalised linear model. The main difference between multivariate methods and generalised linear model is, in multivariate cases either explonatory variables or reponse variables are unknown and we have to estimate the related parameters, say coefficients, covariance ect. while both reponse variables and explanatory variables are known and the target is to find a proper modelling approach. I will show that, compared with generalised linear model, what is special with multivariate methods is additional steps for relating the known variables and latent variables and estimate those parameters.

I will first discuss factor analysis under this framework.
#### Factor Analysis (Explanatory & Confirmatory)
The objective of factor analysis is for re-representing the data with fewer variables. The objective may serve for some substantive purposes, such as dimension reduction and generalise some implicit factors for theoretical purposes. Whatever the final attempts are, the explicit result of factor analysis gives a re-representation of the data with fewer variables. You may also notice that the factors and factors as linearly related in factor analysis. Thus, we can write down the following linear model:<br>
$$X=\mu+\Lambda \xi+\delta$$<br>
where $$\mu$$ is the intercept, $$\Lambda$$ is the coefficient matrix, $$\xi$$ is the factor matrix (explanatory variables) and $$\delta$$ is the residual (error term) in GLM language. For simplicity, we just consider $$X_{i}$$ at this stage, and we can show the shapes of vectors or matrix as follow:<br>
$$X\in\mathbb{R}^{p\times1}$$;<br>
$$\Lambda\in\mathbb{R}^{p\times k}$$;<br>
$$\xi\in\mathbb{R}^{k\times1}$$;<br>
$$\delta\in\mathbb{R}^{p\times1}$$.<br>
Then we should figure out some methods to estimate the parameters.
If we know the value of $$\mu$$, $$\Lambda$$ and $$\delta$$, then we can get $$\xi$$ using the following formula:<br>
$$\xi=(\Lambda^{T}\Lambda)^{-1}\Lambda^{T}(X-\mu-\delta)$$.
You may have noticed that, to get the value of $$\xi$$, the matrix, $$\Lambda^{T}\Lambda$$ should be nonsingular. You may also notice that $$\xi$$, $$\Lambda$$ we get are not necessarily unique, which may make the model unidentifiable. For instance, we can find any inversible matrix to multiple the $$\Lambda$$ to be the new loading matrix. We can get:<br>
$$X=\mu+\Lambda G^{-1}\xi+\delta$$<br>
$$[(\Lambda G^{-1})^{T}\Lambda G^{-1}]^{-1}(\Lambda G^{-1})^{T}(X-\mu-\delta)=\xi$$<br>
$$(\Lambda^{T}\Lambda)^{-1}\Lambda(X-\mu-\delta)=G^{-1}\xi$$<br>
Therefore, for identifiability of the model, we need to add some constraints to $$\Lambda$$ to make it no longer be rotated. We can impose some constraints to the loading matrix that some entry should be at some value. <br>
In some cases, such as confirmatory factor analysis, the constraints are to be imposed with some substantive knowledge. In explanatory factor analysis, we may set some arbitraty constraints for mathematical convenience, that set the upper triangular entries of $$\Lambda$$ to be zero.<br>
Now let's go back to the linear model for X and $$\xi$$:<br>
$$X=\mu+\Lambda\xi+\delta$$<br>
What we need to estimate are: $$\mu$$, $$\Lambda$$, non-zero entries of the covariance matrix of $$\delta$$.<br> 
We can count the number of free parameters.<br>
$$\mu$$: $$p$$ <br>
$$\Lambda$$: $$p\times k$$$$-k\times (k-1)$$ <br>
Remark: The reason for minusing $$k\times(k-1)$$ is that we set the upper triangular entries to zero to deal with the problem of rotational indeterminacy<br>
$$\delta$$: $$p$$ <br>
Remark: We assume the unique factors are independent with each other. If needed, we can allow some dependencies between them and the number of free parameters here would be different consequently.<br>

#### The Estimation of Parameters
Now that we have a linear model for factors and explicit variables, which is:<br>
$$X=\mu+\Lambda\xi+\delta$$<br>
then we need to find some approaches to estimate the parameters of interests.<br>
As a greedy statiscian, there is no doubt that I wish to get the estimates of all unknown parameters directly from the data. Because in this way, I can reduce the human intervention to the minimum and declare it is all from the data, disguising the result to be neutral and subjective. However, it is not impossible in many realistic cases, as the problem of identifiability may hinder the splendid objective. <br>
Let's return to the estimation of parameters. Sometimes we may assume the variables to follow a multivariate normal distribution, which usually looks like this:<br>
$$f(X)=[det(2\pi\Sigma)]^{-\frac{1}{2}}exp\{-\frac{1}{2}(X-\mu)^{T}\Sigma^{-1}(X-\mu)\}$$<br>
where $$\mu=\mu$$, $$\Sigma=\Lambda\Phi\Lambda^{T}+\Omega$$<br>
To express it in a concise way:<br>
$$X\sim N(\mu, \Lambda\Phi\Lambda^{T}+\Omega)$$<br>
We assume $$\xi\sim N(0,\Phi)$$ and $$\delta\sim N(0,\Omega)$$.
With the assumptions above, we also simply estimate the parameters with maximum likelihood estimation method. 
Due to the nice property of factor analysis, it is invariant in scale. Thus, we can standardize the data, and get a correlation matrix $$S$$.<br>
$$L=\Pi^{n}_{i=1} f(X_{i})=[det(2\pi\Sigma)]^{-\frac{n}{2}}exp\{-\frac{1}{2}\sum_{i=1}^{n}(X_i-\mu)^{T}\Sigma^{-1}(X_i-\mu)\}$$ <br>
We can define $$S=\frac{1}{n}\sum^{n}_{i=1}x_{i}x_{i}^{T}$$. for convenience.<br>
Then $$L=\Pi^{n}_{i=1} f(X_{i})=[det(2\pi\Sigma)]^{-\frac{n}{2}}exp\{-\frac{n}{2}\Sigma^{-1}S\}$$.<br>
$$l(\theta)=-\frac{n}{2}det(2\pi\Sigma)-\frac{n}{2}tr(\Sigma^{-1}S)$$<br>
where $$\Sigma=\Lambda\Phi\Lambda^{T}+\Omega$$.<br>
To make the optimization proble solvable with traditional methods (such as New-Raphson Method), we could impose some constraints on the parameters for mathematical convenience.<br>
1.We can set $$\Phi$$ to be an identity matrix $$\mathbb{I}_{k\times k}$$ and replace $$\Lambda$$ with $$\Lambda\Phi^{-\frac{1}{2}}$$. <br>
2.We can set the upper triangular entries of $$\Lambda$$ to be zero. <br>
After imposing these constraints, we can again calculate the parameters that we need to estimate:<br>
1.$$\Lambda$$: $$p\times k-\frac{k(k-1)}{2}$$<br>
2.$$\Phi$$: 0, as we set it to be $$\mathbb{I}$$.<br>
3.$$\Omega$$: p, as we assume it to be a diagonal matrix, $$diag\{\delta_{1},...,\delta_{p}\}$$.<br>
To sum them up, the result is $$(k+1)p-\frac{k(k-1)}{2}$$.<br>
Since we assume $$\mu$$ to be 0, we do not include them here. If the vector of $$\mu$$ is not a zero-vector, then we can simply estimate them.In this case, the number of free parameters should be $$(k+2)p-\frac{k(k-1)}{2}$$.<br>
##### Normality Assumption is Not Necessary
For estimation, normality assumption is not necessary. Without normality assumption or any other assumptions about the distribution, we can no longer use maximum likelihood estimation. We can instead use some other methods. For generalisation, what we need to do is to find a set of parameters which can minimise the "distance" between the observed values and predicted values.<br>
Maximum likelihood estimation, in fact, also does the work of minimising the distance, which is Kullback-Leibler divergence. In strict sense, the Kullback-Leibler divergence is not distance, since it is not symmetric. It is defined as:<br>
$$D_{KL}(P||Q)=\int_{-\infty}^{\infty}p(x)log(\frac{p(x)}{q(x)})dx$$ (continuous case)<br>
$$D_{KL}(P||Q)=\sum_{x\in X}p(x)log(\frac{p(x)}{q(x)})$$ (discrete case)<br>

##### tbc...







 
