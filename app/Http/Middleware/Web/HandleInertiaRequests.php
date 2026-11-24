<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentUserResolver;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Drivers\InstalledVersion;
use App\Contracts\Navigation\NavigationRecords;
use App\Contracts\Settings\SettingsResolver;
use App\Contracts\Sharing\SharePolicy;
use App\Data\Pages\CurrentUserData;
use App\Data\Sharing\SharedData;
use App\Http\Responses\NotificationProps;
use App\Http\Responses\PageReadProps;
use App\Http\Responses\SearchProps;
use App\Support\ActorContext;
use App\Support\CoreSettings;
use App\Support\InstallationFaults;
use App\Values\ChatMemberAuthority;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\ResponseFactory;

/**
 * The one Inertia middleware: the root view, the asset version and the shared Data every page receives.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        private readonly SettingsResolver $settings,
        private readonly CoreSettings $core,
        private readonly CurrentUserResolver $users,
        private readonly NavigationRecords $navigation,
        private readonly ResponseFactory $inertia,
        private readonly SharePolicy $sharing,
        private readonly InstalledVersion $version,
        private readonly InstallationFaults $installationFaults,
        private readonly CurrentActor $actors,
        private readonly NotificationProps $notifications,
        private readonly PageReadProps $pageReads,
        private readonly SearchProps $search,
    ) {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $this->users->currentUser();

        if ($user->isEmpty()) {
            return [
                ...parent::share($request),
                ...SharedData::from(
                    ['name' => $this->settings->string($this->core->displayName), 'version' => $this->version->label()],
                )->toArray(),
            ];
        }

        return [
            ...parent::share($request),
            ...SharedData::from(
                [
                    'name' => $this->settings->string($this->core->displayName),
                    'version' => $this->version->label(),
                    'currentUser' => CurrentUserData::from($user->get()),
                    'canShare' => $this->sharing->mayManage(ActorContext::forUser($user->get()->id)),
                    // A chat member is a guest: what the installation could not heal is the operator's to see.
                    'installationFaults' => $this->isChatMember() ? [] : $this->installationFaults->current(),
                    ...$this->refusalCodeOf($request),
                ],
            )->toArray(),
            // The navigation the signed-in user may see, and its counts after the page, so a slow count never holds it
            // up.
            'navigation' => fn () => $this->navigation->tree($request),
            // A chat member is shown no journal counts: it sees only the chats it is in.
            'navigationCounts' => $this->isChatMember()
                ? []
                : $this->inertia->defer(fn () => $this->navigation->counts(), 'navigation-counts'),
            // The bell's notifications, read only by a partial reload that names them.
            ...($this->isChatMember() ? [] : $this->notifications->of($request)),
            // The keyboard palette's search and its scope picker, read only by a partial reload that names them.
            ...($this->isChatMember() ? [] : $this->search->of($request)),
            // The reads pages declare beside their own result, each read only by a partial reload that names it.
            ...$this->pageReads->of($request),
        ];
    }

    private function isChatMember(): bool
    {
        return $this->actors->hasActor() && $this->actors->authority() instanceof ChatMemberAuthority;
    }

    /**
     * The stable code of the refusal the last form was answered with, when it was refused.
     *
     * @return array{refusalCode?: string}
     */
    private function refusalCodeOf(Request $request): array
    {
        $code = $request->session()->get(CommandRefusal::CODE_FLASH_KEY);

        return is_string($code) ? ['refusalCode' => $code] : [];
    }
}
