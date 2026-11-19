<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * Where the host writes a start's skill set and what the start adds so the program finds it: a folder inside the
 * start's isolated settings folder, and the arguments that come right before that folder's absolute path. Typed
 * values, never shell text.
 */
final readonly class SkillDelivery
{
    /**
     * @param  list<string>  $folderArguments  the arguments the host puts before the folder's path, none when the
     *                                         program finds the folder by itself
     */
    public function __construct(
        public string $folder,
        public array $folderArguments,
    ) {}
}
