---
title: Optional Parameter in AWS CloudFormation Stack YAML
date: "2018-03-26T06:21:37.121Z"
template: "post"
draft: false
slug: "/2018/optional-parameter-aws-cloudformation-stack-yaml"
category: "Blog"
tags:
  - "team"
  - "coding"
image: "cloud-formation.png"
---

The following YAML CloudFormation stack creates an EBS volume returning its reference for further usage in a higher level template.

I've chosen to use the value "false" for _SnapshotId_ when I have no desire to restore from a previously created snapshot.

```
Description: create an EBS data volume

Parameters:
    DiskSize:
        Description: Disk size in GB
        Type: Number
        Default: 10

    SnapshotId:
        Description: Snapshot from where to restore the disk
        Type: String
        Default: false

Conditions:
    IsNewDisk: !Equals [ !Ref SnapshotId, false ]

Resources:
    EBSVolume:
        Type: AWS::EC2::Volume
        Properties:
            VolumeType: gp2
            Size: !Ref DiskSize
            SnapshotId: 
                Fn::If:
                - IsNewDisk
                - Ref: AWS::NoValue
                - Ref: SnapshotId
            AvailabilityZone: !Select [ 0, !GetAZs ]

Outputs:
    EBSVolume:
        Value: !Ref EBSVolume

```

The two relevant pieces of information are `Fn::If` and `AWS::NoValue`.
And it was not easy to find out about them in the documentation.

I found out about the `AWS::NoValue` from [this post](https://cloudonaut.io/optional-parameter-in-cloudformation/), but the syntax refers to JSON and I am using YAML. I'm no expert in that so it has been no easy to put together the condition with nested functions.

I have finally found the last piece of relevant information in [this AWS documentation page](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html) which is not about conditionals, but just about pseudo parameters.
