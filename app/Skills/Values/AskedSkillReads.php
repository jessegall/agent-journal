<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * What asking a session to read skills answers: the keys it is now asked to read.
 */
final readonly class AskedSkillReads
{
    /**
     * @param  list<string>  $skillKeys
     */
    public function __construct(public array $skillKeys) {}
}
