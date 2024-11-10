---
title:  "Survival | Two Forms of Survival Analysis Model: Proportional Hazard & Accelerated Failure Time"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

### The post is for having myself familarising the content. 

### Proportion Hazard& Accelerated Failure Time
A parametric model takes the form of __proportional hazard__ form if: <br>
$$h(y)=h_{0}(y)exp(X^{T}\beta)$$
<br>
A parametric model takes the form of __accelerated failure time__ form if:<br>
$$s(y)=s_{0}(exp\{-X^{T}\beta\}y)$$
<br>
The two formulas above are the standard and general form of PH and AFT form respectively.

### Example: Weibull Distribution
Weibull distribution takes the following formula as probability density function: <br>
$$f(y)=\alpha\lambda y^{\alpha -1}e^{-\lambda y^{\alpha}}$$ <br>
We can derive all related functions of survival analysis from the probability density function.<br>
$$F(y)=\int^{y}_{-\infty}f(y)=1-e^{-\lambda y^{\alpha}}$$<br>
$$S(y)=1-F(y)=e^{-\lambda y^{\alpha}}$$<br>
$$h(y)=\frac{f(y)}{S(y)}=\alpha \lambda y^{\alpha - 1}$$<br>

Then we can try to derive the standard form of PH and AFT to check whether Weibull distribution can be used in PH and AFT form.<br>
#### PH form
We can use $$e^{X^{T}\beta}$$ to predict $$\lambda$$, which is:<br>
$$h(y)=\alpha e^{\beta_{0}+X^{T}\beta}y^{\alpha -1}=[\alpha e^{\beta_{0}}y^{\alpha-1}]e^{X^{T}\beta}=h_{0}(y)e^{X^{T}\beta}$$.<br>
Uh, $$h(y)$$ can be re-expressed in PH form.

#### AFT form
We can still use $$e^{X^{T}\beta}$$ to predict $$\lambda$$, which is:<br>
$$S(y)=e^{-\lambda y^{\alpha}}=e^{-e^{X^{T}\beta}y^{\alpha}}=e^{-[e^{\beta_{0}}e^{X^{T}\beta}]y^{\alpha}}=e^{[-e^{\beta_{0}}][e^{X^{T}\beta}y^{\alpha}]}$$<br>
where $$\lambda_{0}=e^{\beta_{0}}$$ and $$y_{0} = e^{\frac{-X^{T}[-\beta]}{\alpha}}y$$.
Uh, $$S(y)$$ can be re-expressed in AFT form. <br>
The derivation process demostrated here is not exactly the natural way for deriving, because I used $$e^{X^{T}\beta}$$ to predict $$\lambda$$. In a more natural way, we should have such a formula:<br>
$$y=e^{-X^{T}\beta}y$$

The derivations above reveal the relationship between PH form and AFT form in Weibull distribution. The coefficients in these two forms are almost the same, and can be interpreted in some similar ways. However, it is not always the case that the coefficients of the two forms are linked by some constant (in this case "$$-\frac{1}{\alpha}$$").

<br>
<br>
Note: It can be observed from the probability density function above that it is exactly the pdf of exponential distribution when $$\alpha=1$$, which is:<br>
$$f(y)=\lambda e^{\lambda y}$$
