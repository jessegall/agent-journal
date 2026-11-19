<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

/**
 * An open acme verify request whose rule and reader are already approved, before each test.
 */
trait StartsWithApprovedAcmePair
{
    use RunsAcmeRequests;

    protected function setUpStartsWithApprovedAcmePair(): void
    {
        $this->openAcmeRequest();
        $this->approvePair();
    }
}
