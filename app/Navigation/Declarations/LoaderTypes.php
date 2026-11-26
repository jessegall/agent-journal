<?php

declare(strict_types=1);

namespace App\Navigation\Declarations;

use Spatie\LaravelData\Data;

/**
 * The two Data classes a loader's reader takes and answers, checked to be its owner's.
 */
final readonly class LoaderTypes
{
    /**
     * @param  class-string<Data>  $input
     * @param  class-string<Data>  $answer
     */
    public function __construct(public string $input, public string $answer) {}
}
