---
title:  "Specifications of Measure and Sub-structural Models"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

#### Specifications of Measure and Sub-structural Models
I think it to be a convenient way to have a general picture of various multivariate models to put the specifications of those models together. <br>

##### Principal Component Analysis
$$Y_{i}=a_{i}^{T}X,i=1,...,k$$

##### Factor Analysis
$$X=\mu + \Lambda\xi+\delta$$

##### Latent Trait Analysis
$$logit(\pi_{j}|\xi)=\tau_{j}+\lambda_{j}^{T}\xi$$<br>
__Underlying Variable Formulation__:<br>
$$X^{*}=\tau+\Lambda\xi$$<br>
__Ordinal Response__:<br>
$$P(X_{j}\le l|\xi)=f(\tau_{jl}+\lambda_{j}^{T}\xi),l=1,...,K_{j}-1$$<br>
__Multinomial Logistic Model:__<br>
$$log(\frac{P(x_{j}=l|\xi)}{P(X_{j}=1|\xi)})=\tau_{jl}+\lambda_{jl}^{T},l=2,...K_{j}$$

##### Latent Class Model
__For Binary Data:__<br>
$$O(X=x|\xi=j)=\Pi_{i=1}^{p}\pi_{ij}^{x_{i}}(1-\pi_{ij})^{1-x_{i}}$$<br>
$$P(\xi=j)=\nu_{j}$$, where $$\sum^{k}_{j=1}\nu_{j}=1$$<br>
$$P(X=x,\xi=j)=\Pi_{i=1}^{p}\pi_{ij}^{x_{i}}(1-\pi_{ij})^{1-x_{i}}\nu_{j}$$<br>
From the joint distribution, we can obtain the distribution for $$X$$:<br>
$$P(X=x)=\sum^{k}_{j=1}\nu_{j}\Pi^{p}_{i=1}\pi_{ij}^{x_{i}}(1-\pi_{ij})^{1-x_{i}}$$<br>
We use $$\Theta$$ to denote the parameter space, where $$\pi_{ij}$$ is between 0 and 1 and $$\nu_{j}s$$ satisfy that $$\nu_{j}\ge 0$$ and $$\sum^{k}_{j=1}\nu_{j}=1$$. The number of free parameters is thus $$dim(\Theta)=pk+k-1$$.<br>

#### Structural Equation Models
__Structural Submodel:__<br>
$$\eta=B\eta+\Gamma\xi+\zeta$$<br>
$$\eta=(I-B)^{-1}(\Gamma\xi+\zeta)$$<br>
$$\xi\sim N(0,\Phi)$$<br>
$$\zeta\sim N(0,\Phi)$$ and is independent of $$\xi$$.<br>

__Measurement Submodel:__<br>
The measurement submodel specifies two CFA models for the measurement of $$\xi$$ and $$\eta$$. Let $$X$$ be the observed indicators for $$\xi$$ and $$Y$$ be the observed indicators for $$\eta$$. Then the measurement model specifies the conditional distribution of $$(X^{T},Y^{T})^{T}$$ given $$(\xi^{T},\eta^{T})^{T}$$. More specifically, it assumes that:<br>
$$X=\Lambda_{X}\xi+\delta$$<br>
and <br>
$$Y=\Lambda_{Y}\eta+\epsilon$$<br>
where $$\Lambda_{X}$$ and $$\Lambda_{Y}$$ are the loading matrices, and $$\delta$$ and $$\eta$$ are the measurement errors. It is assumed that $$\delta$$, $$\xi$$ and $$(\xi^{T},\eta^{T})^{T}$$ are independent. It further assumed that<br>
$$\delta\sim N(0,\Omega_{\delta})$$<br>
and<br>
$$\epsilon\sim N(0,\Omega_{\epsilon})$$.
