<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files;
use App\Enums\Place;
use App\Exceptions\ReleaseMissing;
use App\Exceptions\ServerOriginInvalid;
use App\Exceptions\TicketMalformed;
use App\Values\FilePath;

/**
 * The shell script an install line pipes into sh: Resources/install.sh with this server's canonical origin, the
 * current release, the digest of its second-stage installer and the one-time ticket filled in.
 */
final readonly class InstallScript
{
    private const string TEMPLATE = 'app/Connections/Resources/install.sh';

    private const string SECOND_STAGE = 'scripts/install-relay.sh';

    public function __construct(
        private Files $files,
        private PublishedReleases $releases,
        private ServerOrigin $origin,
    ) {}

    /**
     * @throws TicketMalformed
     * @throws ReleaseMissing
     * @throws ServerOriginInvalid
     */
    public function render(string $ticket): string
    {
        if (preg_match('/\A[A-Za-z0-9_-]+\z/', $ticket) !== 1) {
            throw TicketMalformed::outsideBase64Url();
        }

        $release = $this->releases->current();

        return strtr($this->files->codeFile(FilePath::in(Place::Project, self::TEMPLATE)), [
            '@@ORIGIN@@' => $this->origin->canonical(),
            '@@VERSION@@' => $release->version,
            '@@RELAY_SHA256@@' => $release->sharedDigestOf(self::SECOND_STAGE),
            '@@TICKET@@' => $ticket,
        ]);
    }
}
