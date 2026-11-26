<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\Pipe;

/**
 * A fixture pipe that drops the first word of a text.
 */
final readonly class DropFirstWord implements Pipe
{
    public function handle(Words $words): Words
    {
        $rest = strstr($words->text, ' ');

        return new Words($rest === false ? '' : ltrim($rest));
    }
}
