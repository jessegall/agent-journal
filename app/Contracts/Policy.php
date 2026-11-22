<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * A policy guards one model: a command, a read or an audit line names the resource by the policy, without loading a
 * record, opening a transaction or constructing the policy.
 */
interface Policy
{
    /**
     * @return class-string<Model>
     */
    public static function model(): string;
}
