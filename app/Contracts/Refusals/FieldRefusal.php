<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Contracts\Bus\CommandRefusal;

/**
 * A refusal a form shows beside one of its fields, in a sentence for the person who sent it.
 */
interface FieldRefusal extends CommandRefusal
{
    /**
     * The form field the refusal is shown beside.
     */
    public function field(): string;

    /**
     * The sentence the form shows.
     */
    public function fieldError(): string;
}
