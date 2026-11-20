<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Which of the two images the build script records: the one every agent runs in, or the console's runner.
 */
enum DockerImageName: string
{
    case Agent = 'agent';
    case Runner = 'runner';
}
