<?php

declare(strict_types=1);

use App\Support\Octane\GiveRequestContainerToEvents;
use App\Support\Octane\GiveRequestItsTimeLimit;
use Laravel\Octane\Contracts\OperationTerminated;
use Laravel\Octane\Events\OperationReleased;
use Laravel\Octane\Events\RequestHandled;
use Laravel\Octane\Events\RequestReceived;
use Laravel\Octane\Events\RequestTerminated;
use Laravel\Octane\Events\TaskReceived;
use Laravel\Octane\Events\TaskTerminated;
use Laravel\Octane\Events\TickReceived;
use Laravel\Octane\Events\TickTerminated;
use Laravel\Octane\Events\WorkerErrorOccurred;
use Laravel\Octane\Events\WorkerStarting;
use Laravel\Octane\Events\WorkerStopping;
use Laravel\Octane\Listeners\CloseMonologHandlers;
use Laravel\Octane\Listeners\CollectGarbage;
use Laravel\Octane\Listeners\DisconnectFromDatabases;
use Laravel\Octane\Listeners\EnsureUploadedFilesAreValid;
use Laravel\Octane\Listeners\EnsureUploadedFilesCanBeMoved;
use Laravel\Octane\Listeners\FlushOnce;
use Laravel\Octane\Listeners\FlushTemporaryContainerInstances;
use Laravel\Octane\Listeners\FlushUploadedFiles;
use Laravel\Octane\Listeners\ReleaseFreedMemory;
use Laravel\Octane\Listeners\ReportException;
use Laravel\Octane\Listeners\StopWorkerIfNecessary;
use Laravel\Octane\Octane;

return [

    // Octane Server: This value determines the default "server" that will be used by Octane when starting, restarting,
    // or stopping your server via the CLI.

    'server' => env('OCTANE_SERVER', 'roadrunner'),

    // Force HTTPS: When this configuration value is set to "true", Octane will inform the framework that all absolute
    // links must be generated using the HTTPS protocol.

    'https' => env('OCTANE_HTTPS', false),

    // Octane Listeners: All of the event listeners for Octane's events are defined below.

    'listeners' => [
        WorkerStarting::class => [
            EnsureUploadedFilesAreValid::class,
            EnsureUploadedFilesCanBeMoved::class,
        ],

        RequestReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            ...Octane::prepareApplicationForNextRequest(),
            GiveRequestContainerToEvents::class,
            GiveRequestItsTimeLimit::class,
        ],

        RequestHandled::class => [
            //
        ],

        RequestTerminated::class => [
            // FlushUploadedFiles::class,
        ],

        TaskReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            GiveRequestContainerToEvents::class,
            //
        ],

        TaskTerminated::class => [
            //
        ],

        TickReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            GiveRequestContainerToEvents::class,
            //
        ],

        TickTerminated::class => [
            //
        ],

        OperationTerminated::class => [
            FlushOnce::class,
            FlushTemporaryContainerInstances::class,
            // DisconnectFromDatabases::class,
        ],

        OperationReleased::class => [
            // CollectGarbage::class,
            // ReleaseFreedMemory::class,
        ],

        WorkerErrorOccurred::class => [
            ReportException::class,
            StopWorkerIfNecessary::class,
        ],

        WorkerStopping::class => [
            CloseMonologHandlers::class,
        ],
    ],

    // Warm / Flush Bindings: The bindings listed below will either be pre-warmed when a worker boots or they will be
    // flushed before every new request.

    'warm' => [
        ...Octane::defaultServicesToWarm(),
    ],

    'flush' => [
        //
    ],

    // Octane Swoole Tables: While using Swoole, you may define additional tables as required by the application.

    'tables' => [
        'example:1000' => [
            'name' => 'string:1000',
            'votes' => 'int',
        ],
    ],

    // Octane Swoole Cache Table: While using Swoole, you may leverage the Octane cache, which is powered by a Swoole
    // table.

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],

    // File Watching: The following list of files and directories will be watched when using the --watch option offered
    // by Octane.

    'watch' => [
        'app',
        'bootstrap',
        'config/**/*.php',
        'database/**/*.php',
        'public/**/*.php',
        'resources/**/*.php',
        'routes',
        'composer.lock',
        '.env',
    ],

    // Garbage Collection Threshold: When executing long-lived PHP scripts such as Octane, memory can build up before
    // being cleared by PHP.

    'garbage' => 50,

    // Maximum Execution Time: The following setting configures the maximum execution time for requests being handled by
    // Octane.

    'max_execution_time' => 30,

    // Octane Server State File: This value determines where Octane stores the state file used to track the running
    // server's master process ID and admin endpoint, which is read by various Octane commands.

    'state_file' => env('OCTANE_STATE_FILE', storage_path('logs/octane-server-state.json')),

    // RoadRunner Options: The following options are only used when the RoadRunner server is the server powering your
    // application.

    'roadrunner' => [
        'command' => env('OCTANE_ROADRUNNER_COMMAND', 'vendor/bin/roadrunner-worker'),
        'http_middleware' => env('OCTANE_ROADRUNNER_HTTP_MIDDLEWARE', 'static'),
    ],

];
