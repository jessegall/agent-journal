<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Contracts\Actors\CurrentActorSetter;
use App\Exceptions\AccountLabelInvalid;
use App\Models\Accounts\Account;
use App\Support\ActorReference;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The saved accounts, their selection rows and sign-in attempts: only the owner reads them, a driver has one
 * selection row, one attempt at a time writes an account's folder, and a removed account keeps its row and label.
 */
final class AccountStorageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_a_label_is_trimmed_and_never_a_path_or_control_text(): void
    {
        $this->assertSame('Work', AccountLabel::from('  Work ')->label);
        $this->assertSame('work', AccountLabel::from('Work')->key());

        foreach (['', '   ', str_repeat('a', 81), '../home', 'a\\b', "line\nbreak"] as $text) {
            try {
                AccountLabel::from($text);
                $this->fail("The label \"{$text}\" was accepted.");
            } catch (AccountLabelInvalid) {
                $this->addToAssertionCount(1);
            }
        }
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
