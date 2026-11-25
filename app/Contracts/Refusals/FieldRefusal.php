<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use Throwable;

/**
 * A refusal of a request's own input that names the fields it refuses, so a reader's answer can show each message
 * beside its field, as a validation error would.
 */
interface FieldRefusal extends Throwable
{
    /**
     * @return array<string, string> the message of each refused field, by its name
     */
    public function fieldErrors(): array;
}
