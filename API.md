# API Reference

**Classes**

Name|Description
----|-----------
[Kaniko](#cdk-kaniko-kaniko)|*No description*


**Structs**

Name|Description
----|-----------
[KanikoProps](#cdk-kaniko-kanikoprops)|*No description*



## class Kaniko  <a id="cdk-kaniko-kaniko"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Kaniko(scope: Construct, id: string, props: KanikoProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[KanikoProps](#cdk-kaniko-kanikoprops)</code>)  *No description*
  * **context** (<code>string</code>)  Kaniko build context. 
  * **contextSubPath** (<code>string</code>)  The context sub path. __*Optional*__
  * **destinationRepository** (<code>[IRepository](#aws-cdk-aws-ecr-irepository)</code>)  The target ECR repository. __*Default*__: create a new ECR private repository
  * **dockerfile** (<code>string</code>)  The Dockerfile for the image building. __*Default*__: Dockerfile



### Properties


Name | Type | Description 
-----|------|-------------
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | <span></span>
**destinationRepository** | <code>[IRepository](#aws-cdk-aws-ecr-irepository)</code> | <span></span>
**task** | <code>[FargateTaskDefinition](#aws-cdk-aws-ecs-fargatetaskdefinition)</code> | <span></span>

### Methods


#### buildImage(id, schedule?) <a id="cdk-kaniko-kaniko-buildimage"></a>

Build the image with kaniko.

```ts
buildImage(id: string, schedule?: Schedule): void
```

* **id** (<code>string</code>)  *No description*
* **schedule** (<code>[Schedule](#aws-cdk-aws-events-schedule)</code>)  The schedule to repeatedly build the image.






## struct KanikoProps  <a id="cdk-kaniko-kanikoprops"></a>






Name | Type | Description 
-----|------|-------------
**context** | <code>string</code> | Kaniko build context.
**contextSubPath**? | <code>string</code> | The context sub path.<br/>__*Optional*__
**destinationRepository**? | <code>[IRepository](#aws-cdk-aws-ecr-irepository)</code> | The target ECR repository.<br/>__*Default*__: create a new ECR private repository
**dockerfile**? | <code>string</code> | The Dockerfile for the image building.<br/>__*Default*__: Dockerfile



