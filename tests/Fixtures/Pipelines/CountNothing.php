<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Contracts\Bus\Pipe;

/**
 * A fixture pipe that counts an empty text as nothing at all.
 */
final readonly class CountNothing implements Pipe
{
    public function handle(Words $words): Counted
    {
        return new Counted(-1);
    }
}
