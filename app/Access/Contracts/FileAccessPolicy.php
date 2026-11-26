<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Files\Enums\FileAccess;
use App\Values\AgentText;
use PhpOption\Option;

/**
 * Judges one file an agent's tool reads or writes, before any state is asked; the area that binds it knows why.
 */
interface FileAccessPolicy
{
    /**
     * The refusal the agent reads when this session may not touch the file; it names no other session or path.
     *
     * @return Option<AgentText>
     */
    public function refusalFor(string $sessionId, FileAccess $access, string $path): Option;
}
