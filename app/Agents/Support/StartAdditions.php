<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\OfflineReplyMode;

/**
 * What other areas add to one start as the host takes its grant: folders to write in its settings folder, with the
 * arguments that point the program at them.
 */
final class StartAdditions
{
    /**
     * @var list<StartFolder>
     */
    private array $folders = [];

    private OfflineReplyMode $offlineReply = OfflineReplyMode::Refuse;

    public function addFolder(StartFolder $folder): void
    {
        $this->folders[] = $folder;
    }

    /**
     * @return list<StartFolder>
     */
    public function folders(): array
    {
        return $this->folders;
    }

    /**
     * Lets the start's relay answer neutrally while the journal is unreachable; a start refuses unless granted.
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
