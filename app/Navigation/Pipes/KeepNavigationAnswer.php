<?php

declare(strict_types=1);

namespace App\Navigation\Pipes;

use App\Bus\Contracts\Pipe;
use App\Navigation\NavigationRaiseAnswer;

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
