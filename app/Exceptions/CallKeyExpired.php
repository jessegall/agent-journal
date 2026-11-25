<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The request key is too old to answer: the journal answered request_key_expired.
 */
final class CallKeyExpired extends ApiRefused
{
    public const string CODE = 'request_key_expired';

    /**
     * The original outcome is no longer kept: check the record before deliberately starting a new write, and never
     * send it again without a key.
     *
     * @return list<string>
     */
    public function consoleLines(): array
    {
        return [
            $this->getMessage(),
            'The outcome of the first send is no longer kept. Check the record before you start a new write on purpose.',
        ];
    }
}
