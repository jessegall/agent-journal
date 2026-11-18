<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Pipelines\Contracts\Pipe;

/**
 * A fixture pipe that turns words into their count, and counts how often it is built.
 */
final class CountWords implements Pipe
{
    public static int $built = 0;

    public function __construct()
    {
        self::$built++;
    }

    public function handle(Words $words): Counted
    {
        return new Counted(str_word_count($words->text));
    }
}
