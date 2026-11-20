<?php

declare(strict_types=1);

namespace App\Agents\Pipes;

use App\Agents\Support\NavigationRaiseAnswer;
use App\Pipelines\Contracts\Pipe;

/**
 * Carries an admission answer past the remaining pipes.
 */
final readonly class KeepNavigationAnswer implements Pipe
{
    public function handle(NavigationRaiseAnswer $answer): NavigationRaiseAnswer
    {
        return $answer;
    }
}
