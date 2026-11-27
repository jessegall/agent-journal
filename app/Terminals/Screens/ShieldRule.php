<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Protocol\Payloads\HostShieldRulePayload;

/**
 * A screen the host must never send: one that asks for a secret, known by enough of its keywords appearing on it in
 * any case. The host shields such a frame before it leaves, so neither the journal nor a recording sees its rows.
 */
final readonly class ShieldRule
{
    /**
     * @param  list<string>  $keywords
     */
    public function __construct(public array $keywords, public int $fewestKeywords) {}

    /**
     * The rule as a plan carries it.
     */
    public function protocolData(): HostShieldRulePayload
    {
        return HostShieldRulePayload::from(['keywords' => $this->keywords, 'min_keywords' => $this->fewestKeywords]);
    }
}
