<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Exceptions\ReadPermitMissing;
use App\Support\ReadPermit;
use App\Support\Registry;
use Domain\Sharing\Exceptions\ShareLinkRefused;
use Domain\Sharing\Models\Share;
use Illuminate\Container\Attributes\Scoped;

/**
 * The read permits of one request: the public bridge issues one from a token, the read command takes it once by its
 * reference, and the bridge clears the rest when the request ends. A token never leaves this class.
 */
#[Scoped]
final class ReadPermits
{
    private const int REFERENCE_BYTES = 16;

    /**
     * @var Registry<ReadPermit>
     */
    private readonly Registry $permits;

    public function __construct()
    {
        $this->permits = Registry::replacing(ReadPermitMissing::forReference(...));
    }

    /**
     * A permit for the share the token opens, even one no longer readable, so the read can record its denial; a
     * malformed token is refused before anything is read.
     *
     * @throws ShareLinkRefused
     */
    public function issue(string $token): ReadPermit
    {
        if (! ShareToken::hasShape($token)) {
            throw ShareLinkRefused::malformed();
        }

        $share = Share::forTokenDigest(ShareToken::digestOf($token))->getOrThrow(ShareLinkRefused::unknown());
        $permit = new ReadPermit($share->id, $share->scope_version, bin2hex(random_bytes(self::REFERENCE_BYTES)));
        $this->permits->put($permit->reference, $permit);

        return $permit;
    }

    /**
     * @throws ReadPermitMissing
     */
    public function take(string $reference): ReadPermit
    {
        $permit = $this->permits->get($reference);
        $this->permits->remove($reference);

        return $permit;
    }

    public function clear(): void
    {
        $this->permits->clear();
    }
}
