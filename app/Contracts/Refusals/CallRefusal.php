<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

/**
 * A call's own server refusal, declared on its #[Endpoint]: the code the journal answers it with picks this class
 * before any shared one.
 */
interface CallRefusal
{
    /**
     * The code the journal answers this refusal with.
     */
    public static function code(): string;
}
