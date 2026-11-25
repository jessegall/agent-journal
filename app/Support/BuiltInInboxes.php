<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Inboxes\Inbox;

/**
 * The inboxes Core installs: main, where the main agent is attached and which forwards it, and one source inbox for
 * each principal without a row.
 */
final readonly class BuiltInInboxes
{
    /**
     * The source inbox of each rowless principal, named after its actor type.
     *
     * @var array<string, string>
     */
    public const array SOURCES = ['system' => 'System'];

    public function install(): void
    {
        self::installNamed(Inbox::MAIN, 'Main inbox', true);

        foreach (self::SOURCES as $name => $label) {
            self::installNamed($name, $label, false);
        }
    }

    private static function installNamed(string $name, string $label, bool $forwardsMembers): void
    {
        if (Inbox::named($name)->isEmpty()) {
            Inbox::create(Inbox::NAMED_PROVIDER, $name, $label, $name, $forwardsMembers);
        }
    }
}
