<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Tests\Support\ActsAsOwner;

/**
 * An open acme verify request and the owner who reviews it on the web pages, without the Vite build.
 */
trait OpensAcmeRequestAsOwner
{
    use ActsAsOwner;
    use RunsAcmeRequests;

    protected function setUpOpensAcmeRequestAsOwner(): void
    {
        $this->withoutVite();
        $this->setUpActsAsOwner();
        $this->openAcmeRequest();
    }
}
