<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use Closure;

/**
 * What other Core areas use of the Hooks area's StackTransaction.
 */
interface StackTransaction
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function run(Closure $work): mixed;
}
