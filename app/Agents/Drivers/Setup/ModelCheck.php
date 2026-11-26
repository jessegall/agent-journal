<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\Drivers\Setup\Contracts\ModelAnswerReader;

/**
 * One short model call that proves a key or token works: the driver's arguments, the part that reads its answer and
 * how long it may take.
 */
final readonly class ModelCheck
{
    /**
     * @param  list<string>  $arguments
     * @param  class-string<ModelAnswerReader>  $reader
     */
    public function __construct(public array $arguments, public string $reader, public int $secondsLimit) {}
}
