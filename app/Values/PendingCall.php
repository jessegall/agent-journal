<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Domains\JournalCall;
use Spatie\LaravelData\Data;

/**
 * One call a console command sends, and whether its answer is printed on one line.
 */
final readonly class PendingCall
{
    /**
     * @param  JournalCall<Data>  $call
     */
    public function __construct(public JournalCall $call, public bool $oneLine = false) {}
}
