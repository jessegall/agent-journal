<?php

declare(strict_types=1);

namespace App\Contracts\Domains;

use App\Exceptions\CallFailed;
use Spatie\LaravelData\Data;

/**
 * Sends one signed call to the journal and answers its typed answer.
 */
interface CallSender
{
    /**
     * @template TAnswer of Data
     *
     * @param  JournalCall<TAnswer>  $call
     * @return TAnswer
     *
     * @throws CallFailed
     */
    public function send(JournalCall $call): Data;
}
