<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\Pipe;
use Closure;

/**
 * A fixture pipe that takes the carried value and the rest: an empty text is counted as nothing without the rest.
 */
final readonly class CountNothingOfEmptyText implements Pipe
{
    /**
     * @param  Closure(Words): Counted  $next
     */
    public function handle(Words $words, Closure $next): Counted
    {
        if ($words->text === '') {
            return new Counted(0);
        }

        return $next($words);
    }
}
