<?php

declare(strict_types=1);

namespace App\Recordings\Enums;

/**
 * Why a recording no longer stands for what the code does now, the first that holds.
 */
enum StaleReason: string
{
    case Format = 'the recording format changed';
    case Protocol = 'the host protocol is newer than the recording';
    case Scenario = 'the scenario changed';
    case ImageBuild = "the agent image's build changed";
}
