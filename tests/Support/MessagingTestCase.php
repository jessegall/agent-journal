<?php

declare(strict_types=1);

namespace Tests\Support;

use Tests\TestCase;

/**
 * The cast of a messaging test: the installation's owner and two running agents, Builder and Reviewer, each with its
 * own inbox, and a way to run a command on the bus as one of them.
 */
abstract class MessagingTestCase extends TestCase
{
    use MessagingFixtures;

    protected const array TABLES = self::MESSAGING_TABLES;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpMessaging();
    }
}
