<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\OfflineReplyMode;

/**
 * What other areas add to one launch as the host takes its grant: folders to write in its settings folder, with the
 * arguments that point the program at them.
 */
final class LaunchAdditions
{
    /**
     * @var list<LaunchFolder>
     */
    private array $folders = [];

    private OfflineReplyMode $offlineReply = OfflineReplyMode::Refuse;

    public function addFolder(LaunchFolder $folder): void
    {
        $this->folders[] = $folder;
    }

    /**
     * @return list<LaunchFolder>
     */
    public function folders(): array
    {
        return $this->folders;
    }

    /**
     * Lets the launch's relay answer neutrally while the journal is unreachable; a launch refuses unless granted.
     */
    public function grantOfflineReply(OfflineReplyMode $mode): void
    {
        $this->offlineReply = $mode;
    }

    public function offlineReply(): OfflineReplyMode
    {
        return $this->offlineReply;
    }
}
