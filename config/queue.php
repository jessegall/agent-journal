<?php

declare(strict_types=1);

return [

    // Default Queue Connection Name: Laravel's queue supports a variety of backends via a single, unified API, giving
    // you convenient access to each backend using identical syntax for each.

    'default' => env('QUEUE_CONNECTION', 'redis'),

    // Queue Connections: Here you may configure the connection options for every queue backend used by your
    // application.

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
            'queue' => env('BEANSTALKD_QUEUE', 'default'),
            'retry_after' => (int) env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
            'block_for' => null,
            // A job or broadcast queued inside a transaction is pushed only once it commits, never for rolled-back
            // work.
            'after_commit' => true,
        ],

        'deferred' => [
            'driver' => 'deferred',
        ],

        'background' => [
            'driver' => 'background',
        ],

        'failover' => [
            'driver' => 'failover',
            'connections' => [
                'redis',
                'deferred',
            ],
        ],

    ],

    // Job Batching: The following options configure the database and table that store job batching information.

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'job_batches',
    ],

    // Failed Queue Jobs: These options configure the behavior of failed queue job logging so you can control how and
    // where failed jobs are stored.

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'file'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],

];
