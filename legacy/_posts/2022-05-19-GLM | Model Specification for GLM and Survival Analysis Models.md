---
title:  "GLM | Model Specification for GLM and Survival Analysis Models"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

## Model Specification for GLM and Survival Analysis Models
### Binary Logit Model:
__Canonical Link:__ logit($$\pi_{i}$$)=$$log(\frac{\pi_{i}}{1-\pi_{i}})=x_{i}^{T}\beta$$<br>
__Probit Link:__ g($$\pi_{i}$$)=$$\Phi^{-1}(\pi_{i})$$ where $$\Phi(.)$$ is the probability function of standard normal distribution<br>
__Complementary log-log link:__ g $$(\pi_{i})$$=$$log(-log(1-\pi))$$<br>
#### Latent Variable Representations of Binary Response Models
Suppose that oberved $$Y$$ and latent $$Y^{*}$$ are related as follows:<br>
$$Y=\left\{
\begin{aligned}
1 & &  if \ \ Y^{*}> 0\\
0 & & if \ \ Y^{*}\le 0
\end{aligned}
\right.$$<br>
As a binary variable, $$Y$$ follows the Bernoulli distribution.<br>
Suppose further that the following linear model holds for $$Y^{*}$$:<br>
$$Y^{*}=X^{T}\beta+\epsilon$$<br>
where $$\epsilon\sim f_{\epsilon(\epsilon)}$$ follows a distribution where the pdf $$f_{\epsilon}(.)$$ is symmetric around 0 and has no unknown parameters.<br>
Then<br>
$$\pi=P(Y=1)=P(Y^{*}>0)=P(X^{T}\beta+\epsilon>0)$$<br>
$$\ \ \ \ \ = P(-\epsilon<X^{T}\beta)=P(\epsilon<X^{T}\beta)=P(\epsilon\le X^{T}\beta)$$
$$\ \ \ \ \ = F_{\epsilon}(X^{T}\beta)$$<br>
$$F^{-1}_{\epsilon}(\pi)=X^{T}\beta$$<br>
The model for the binary $$Y$$ which is implied by the linear model for $$Y^{*}$$ and the measure connection between $$Y^{*}$$ and $$Y$$ is a GLM for a Bernoulli response, with link function $$F^{-1}_{\epsilon}(.)$$.

### The Multinomial Logisitic Model:
In a multinomial logistic model, we specify the probabilities $$P(Y_{i}=j)=\pi_{ij}$$ of the multinomial distribution for a polytomous response variable $$Y_{i}$$ for unit i as: <br>
$$log(\frac{\pi_{ij}}{\pi_{i1}})=X^{T}_{i}\beta_{j}$$ for each $$j=2,...,C$$<br>
where $$\beta_{2},....,\beta_{j}$$ are vectors of regression coefficients, different from each other.<br>

### Ordinal Logit Models:
Suppose now that the C categories of a cotegorical Y are in order, as $$1<2<...<C$$.<br>
Define the cumulative reponse probabilities:<br>
$$\gamma_{ij}=P(Y_{i}\le j)=\pi_{i1}+...+\pi_{ij}$$<br>
for $$j=1,...,C$$, where thus $$\gamma_{i1}=\pi_{i1}$$ and $$\gamma_{ic}=1$$.<br>
Clearly also:<br>
$$\pi_{ij}=\gamma_{ij}-\gamma_{i,j-1}$$ for $$j=2,...,C$$ (also for j=1 if we define $$\gamma_{i0}=0$$).<br>
__Other Possibilities:__<br>
Adjacent categories: $$\frac{\pi_{ij}}{\pi_{i,j+1}}$$ for $$j=1,...,C-1$$<br>
Continuation ratios: $$\frac{\sum_{k-1}{j}\pi_{ik}}{\pi_{i,j+1}}$$ for $$j=1,...,C-1$$<br>
#### Cumulative Logit Model (Proportional Odds Model)
It models the log-odds of the $$C-1$$ cumulative probabilities, i.e.:<br>
$$logit(\gamma_{ij})=log(\frac{\gamma_{ij}}{1-\gamma_{ij}})=log[\frac{P(Y_{i}\le j)}{P(Y_{i}>j)}]=\alpha_{j}-X^{T}\beta$$ for $$j=1,...,C-1$$<br>
The $$\alpha_{j}$$ are the intercept parameters of the mode (also known as the threshold parameters), and here no intercept parameter is included in $$\beta$$. By construction, it is true that:<br>
$$\alpha_{1}<\alpha_{2}<...<\alpha_{C-1}$$<br>
__interpretation:__ exp( $$\hat{\beta}_{female}$$ )=1.144. Controlling for age group, the odds that a person's walking frequency is in a higher rather than lower category are 14.4% higher for women than for men. <br>

#### Latent Variable Representation of Ordinal Response Models
Suppose we assume that:<br>
$$Y^{*}=X^{T}\beta+\epsilon$$<br>
where $$\beta$$ does not include an intercept term, and the distribution of $$\epsilon$$ is symmetric around 0, with cdf $$F_{\epsilon}(\epsilon)$$. This gives:<br>
$$\gamma_{ij}=P(Y_{i}\le j)$$<br>
$$\ \ \ \ =P(Y^{*}\le \alpha_{j})$$<br>
$$\ \ \ \ =P(\epsilon \le \alpha_{j}-X^{T}\beta)$$<br>
$$\ \ \ \ =F_{\epsilon}(\alpha_{j}-X^{T}\beta)$$<br>
Assuming that $$\epsilon$$ follows the standard logistic distribution gives the ordinal logit model.<br>

### Poisson Log-linear Model for Counts
Here the observed responses $$y_{i}$$ are assumed to be realisations of independent random variables $$Y_{1},...,Y_{n}$$ where each $$Y_{i}\sim Poisson(\mu_{i})$$ and <br>
$$log(\mu_{i})=X^{T}_{i}\beta$$<br>
and thus<br>
$$\mu_{i}=e^{X^{T}_{i}\beta}$$<br>

#### Exposures
__Models for Rates__<br>
Denoting such exposure with $$t_{i}$$, what we really want to model is the rate $$\frac{\mu_{i}}{t_{i}}$$ of events per unit of exposure (e.g. vistits to a doctor per year).<br>
If we specify a log-linear model for the rates, we obtain<br>
$$\frac{\mu_{i}}{t_{i}}=log(\mu_{i})-log(t_{i})=X^{T}_{i}\beta$$<br>
and thus $$log(\mu_{i})=log(t_{i})+X^{T}_{i}\beta$$<br>
This is of the form of a standard log-linear model, except for the inclusion of the term $$log(t_{i})$$, which has no coefficent to be estimated. $$log(t_{i})$$ is known as an offset.

### Log-linear Model for Contingency
__Log-linear model of independence__<br>
$$log(\mu_{jk})=\lambda + \lambda^{X_1}+\lambda^{X_2}$$<br>
#### The Poisson-Multinomial Connection
Suppose we have 3 variables $$Y$$, $$X_1$$ and $$X_2$$ and treat $$Y$$ as the response.<br>
Consider the all 2-way interaction model (with usual parameter constraints):<br>
$$log(\mu_{jkl})=\lambda + \lambda_{j}^{Y}+\lambda_{k}^{X_1}+\lambda_{l}^{X_2}+\lambda_{jk}^{YX_2}+\lambda^{YX_2}_{jl}+\lambda^{X_{1}X_{2}}_{kl}$$<br>
Suppose Y has 2 categories. The model for the log-odds that $$Y=2$$ is:<br>
$$log[\frac{P(Y=2|X_{1}=k,X_{2}=L)}{P(Y=1|X_{1}=k,X_{2}=L)}]=log(\mu_{2kl})-log(\mu_{1kl})=\lambda_{2}^{Y}+\lambda_{2k}^{YX_1}+\lambda_{2L}^{YX_2}$$<br>
which has the form of a logistic regression model.

### Conditional Logistic and Mixed Logistic Models with Alternative-specific Explanatory Variables
#### The Conditional Logit Model
This is a model with only alternative-specific explanatory variables $$\omega_{ij}$$, defined as:<br>
$$\pi_{ij}=P(Y_{i}=j)=\frac{e^{\gamma\omega_{ij}}}{\sum^{C}_{l=1}\gamma\omega_{il}}$$ for $$i=1,...,n;j=1,...,C$$<br>
which also implies that:<br>
$$log(\frac{\pi_{ij}}{\pi_{ik}})=\gamma (\omega_{ij}-\omega_{ik})$$ for any $$j,k=1,...,C$$<br>

#### The Mixed Logit Model
The mixed logit model can include bothh alternative-specific explanatory variables $$\omega_{ij}$$ and alternative-invariant (subject-specific) explanatory variables $$x_i$$ in the same model.<br>
In an obvious way, this model takes the form:<br>
$$\pi_{ij}=P(Y_i = j)=\frac{e^{\beta_{j}x_{i}+\gamma\omega_{ij}}}{\sum_{l=1}^{C}e^{\beta_{l}x_{i}+\gamma\omega_{il}}}$$<br>
for $$i=1,...,n;j=1,...,C$$.<br>
__Latent-variable Motivation for Mixed Logit Models__<br>
Let $$U_j$$ denote the utility of alternative $$j$$ (for respondent $$i$$, subscript i is omitted for simplicity). The additive random utility model states that<br>
$$U_j = V_j + \epsilon_j$$ for $$j=1,...,C$$<br>
where<br>
$$V_j$$ is a deterministic function of explanatory variables, e.g. $$V_j = \beta_{j}x+\gamma\omega_j$$<br>
$$\epsilon_j$$ is a random variable<br>
The probability that alternative $$j$$ is chosen is thus:<br>
$$\pi_{ij}=P(Y_i = j)=P(U_j \ge U_k)=P(U_j - U_k \ge 0)$$<br>
$$\ \ \ \ P(\epsilon_k - \epsilon_j \le V_j - V_k)$$ for all $$k\ne j$$<br>
To evaluate the probability of the above term, we need to specify the joint distribution of $$\epsilon_j$$ for $$j=1,...,C$$<br>\
If $$\epsilon_j$$ are independent and identically distributed random variables form a type I extreme value distribution, the model for the probabilities $$\pi_{ij}$$ from the above term is a mixed logit model.












