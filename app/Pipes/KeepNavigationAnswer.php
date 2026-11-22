<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Support\NavigationRaiseAnswer;

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
