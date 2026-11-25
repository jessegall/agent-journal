<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Domains\ApiPayload;
use Spatie\LaravelData\Data;

/**
 * One call a console command sends, and whether its answer is printed on one line.
 */
final readonly class PendingPayload
{
    /**
     * @param  ApiPayload<Data>  $call
     */
    public function __construct(public ApiPayload $call, public bool $isOneLine = false) {}
}
