<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\EmptyListState;

/**
 * The No accounts yet state, in the design's words, with the action that opens the account wizard: the Accounts page
 * shows it with no account at all, and the chat with no account signed in.
 */
final readonly class NoAccountsYet
{
    public const string TITLE = 'No accounts yet';

    public const string SENTENCE = 'Agents run on an account. Add a Claude Code or Codex account so they can start '
        .'work.';

    public static function addingWith(LayoutActionData $adding): EmptyListState
    {
        return EmptyListState::build()
            ->title(self::TITLE)
            ->detail(self::SENTENCE)
            ->icon('account')
            ->actions(
                [LayoutPartData::build()
                ->asAction()
                ->key('add')
                ->label('Add account')
                ->action($adding)
                ->style('primary')
                ->finish()],
            )
            ->fillsPage(true)
            ->finish();
    }
}
