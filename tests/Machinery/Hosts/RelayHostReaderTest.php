<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\RelayHostReader;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

#[TestsMachinery(RelayHostReader::class)]
final class RelayHostReaderTest extends TestCase
{
    public function test_an_unknown_field_in_a_relay_claim_is_refused_by_name(): void
    {
        $request = Request::create('/host/instructions/claim?limit=1&wait=0', 'POST', content: '{"extra":true}');

        $this->expectException(HostCallUnreadable::class);
        $this->expectExceptionMessage('extra');
        $this->journal->service(RelayHostReader::class)->assertRequest($request);
    }
}
