<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Exceptions\IncomingWorkRepeated;

/**
 * Where Core and domains register the incoming work every hook accepts, in order.
 */
interface IncomingWorkRegistration
{
    /**
     * @param  class-string<IncomingWork>  $workClass
     *
     * @throws IncomingWorkRepeated
     */
    public function register(string $workClass): void;
}
