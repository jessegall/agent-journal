<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use Inertia\Support\SessionKey;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * A signed-in viewer's pages are kept encrypted in the browser's history and a sign-out clears it, so going back shows
 * nothing private; a guest's pages are neither.
 */
final class HistoryEncryptionTest extends TestCase
{
    public function test_a_signed_in_page_is_encrypted_and_a_guest_page_is_not(): void
    {
        $this->journal->owner();

        $this->actingAs($this->journal->ownerUser())->get('/')->assertInertia(
            fn (AssertableInertia $page) => $this->assertArrayHasKey('encryptHistory', $page->toArray()),
        );
        $this->journal->asGuest();
        $this->get('/login')->assertInertia(function (AssertableInertia $page): void {
            $this->assertArrayNotHasKey('encryptHistory', $page->toArray());
            $this->assertArrayNotHasKey('clearHistory', $page->toArray());
        });
    }

    public function test_signing_out_clears_the_history_on_the_next_page(): void
    {
        $this->journal->owner();

        $signedOut = $this->actingAs($this->journal->ownerUser())->post('/logout');

        $signedOut->assertRedirect('/')->assertSessionHas(SessionKey::CLEAR_HISTORY, true);
    }
}
