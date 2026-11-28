<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens their accounts.
 */
#[TestsRoute('GET', 'accounts.accounts')]
final class AccountsGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_last_account_page_can_open_a_selected_account_from_the_first_page(): void
    {
        $journal = $this->journal->owner()->chooseActiveAccount('codex', 'Account 01', '/journal/accounts/01');
        $first = $journal->chosenAccounts()['codex'];

        foreach (range(2, 26) as $number) {
            $journal->chooseActiveAccount('codex', sprintf('Account %02d', $number), "/journal/accounts/{$number}");
        }

        $this->actingAs($journal->ownerUser())
            ->get(route('accounts.accounts', ['page' => 100, 'account' => $first->id]))
            ->assertInertia(fn (AssertableInertia $inertia) => $inertia
                ->where('page.status', 'ready')
                ->where('page.data.root.children.0.children.1.text', '26')
                ->has('page.data.root.children.1.children.0.children.1.children.0.rows', 1)
                ->where('page.data.root.children.1.children.0.children.1.children.0.rows.0.label', 'Account 26')
                ->where('page.data.root.children.1.children.1.children.0.children.0.text', 'Account 01'));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->hiddenFrom('Member');
    }
}
