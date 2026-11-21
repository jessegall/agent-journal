<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * The environment of the connected binding a request serves, by id: one for a request that came through a binding,
 * none for this installation's own project.
 */
interface ServedEnvironment
{
    /**
     * @return list<string>
     */
    public function environmentIds(): array;
}
