---
title:  "Optimisation | Farkas' Lemma: An Easy Way to Understand"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

_Raw Version_
### Farkas' Lemma: An Easy Way to Understand
  _The short post is for those people who are seeking for an easy interpretation of the Farkas' lemma._<br>
  _I suppose the readers already know what Farkas' lemma is but find it a bit difficult to understand it. Farkas' lemma can be easily interpreted geometrically as most books about optimisation may cover this part. In this post, I am going to give an algebraic interpretation for the important lemma._<br>
 __Farkas' Lemma.__ The system $$Ax=b,x\ge 0$$ is feasible if and only if the system $$u^{T}A\le 0,u^{T}b>0$$ is in feasible.<br>
 The lemma tell us only one of the following systems holds at a time:<br>
 (1)$$Ax=b,x\ge 0$$<br>
 (2)$$u^{T}A\le 0, u^{T}b>0$$.<br>
 In my view, Farkas' lemma is telling a fact about the ___sign (+,-)___.<br>
 Why do I say that?<br>
 $$x\ge 0$$ guarantees that the signs would not flip when multiplying the vector of $$\bold{x}$$. <br>
 $$if:$$
 We can easily get $$u^{T}Ax=u^{T}b$$. As $$x\ge 0$$, if $$u^{T}A\ge 0$$, then $$u^{T}Ax\ge 0$$, and $$u^{T}b$$ must be greater or equal than 0. If $$u^{T}A\le 0$$, then $$u^{T}Ax\le 0$$, and $$u^{T}b$$ must be less or equal than 0.<br> If (1) holds, then (2) is impossible.
 $$only\ \ if:$$
 If (2) holds, then we know that for any $$x\ge 0$$, $$u^{T}Ax\le 0$$, thus $$u^{T}Ax\ne u^{T}b$$ $$\rightarrow$$ $$Ax\ne b$$.<br>
 ___Additional Remark.___ If you are not confident about the statement that $$x\ge 0$$ guarantees the sign, then I will should you some details about how it works.<br>
 Suppose we have $$A\in \mathbb{R}^{m\times n}$$, $$x\in \mathbb{R}^{n\times 1}$$, $$u\in \mathbb{R}^{m\times 1}$$ and $$b\in\mathbb{R}^{m\times 1}$$. $$u^{T}A\in \mathbb{R}^{1\times n}$$, looks like $$[a_1,...,a_n]$$. If $$a_i\ge0$$ for $$i=1,...,n$$, then $$u^{T}Ax=\sum_{i=1}^{n} a_ix_i$$. As $$x\ge0$$, then $$a_ix_i\ge 0$$, $$\sum_{i=1}^{n}a_ix_i\ge0$$. The same logic could also apply for the case where $$u^{T}A\le 0$$. Thus, $$x\ge 0$$ could guarantees that if the entries of a vector are all with the same sign, then the inner product of the vector and a nonnegative vector should be of the same sign.
