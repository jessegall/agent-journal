<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\Bus\Support\ConsoleOwner;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Support\ShareListFilters;
use Illuminate\Console\Command;

/**
 * Lists the journal's shares and proposals for the owner, newest first: number, state, record and deadline, never an
 * address.
 */
final class ShareListCommand extends Command
{
    private const int ROWS = 50;

    protected $signature = 'share:list {--state= : Only shares in this state} {--after= : The id the page starts after}';

    protected $description = 'List shares and proposals, newest first';

    public function handle(ConsoleOwner $owner): int
    {
        $owner->actAsOwner();
        $state = $this->option('state') === null ? null : ShareState::from((string) $this->option('state'));
        $after = $this->option('after') === null ? null : (string) $this->option('after');
        $found = Share::listPage(new ShareListFilters($state, null, null, null, $after), self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);

        $this->table(
            ['Id', 'Number', 'State', 'Record', 'Expires'],
            array_map(fn (Share $share) => [$share->id, $share->number, $share->state->value, "{$share->root_type} {$share->root_id}", $share->expires_at->toIso8601String()], $rows),
        );

        if (count($found) > self::ROWS && $rows !== []) {
            $this->line('More: --after='.$rows[array_key_last($rows)]->id);
        }

        return self::SUCCESS;
    }
}
