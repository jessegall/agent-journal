<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * The kinds of actors their owners registered, read by their stored types; no list of them is kept anywhere else.
 */
interface ActorTypes
{
    /**
     * Every registered type.
     *
     * @return list<string>
     */
    public function types(): array;

    /**
     * The types a request or a command line may name, those of the classes that are recipient actors.
     *
     * @return list<string>
     */
    public function requestTypes(): array;
}
