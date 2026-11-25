<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why a runtime or a request waits instead of going on; None when nothing holds it.
 */
#[TypeScript]
enum HoldReason: string
{
    case None = 'none';
    case Interrupted = 'interrupted';
    case Compacting = 'compacting';
    case UserInput = 'user_input';
    case DriverInput = 'driver_input';
    case PermissionRequired = 'permission_required';
    case TrustRequired = 'trust_required';
    case OnboardingRequired = 'onboarding_required';
    case LoginRequired = 'login_required';
    case UpdateRequired = 'update_required';
    case UsageLimited = 'usage_limited';
    case UnknownScreen = 'unknown_screen';
    case ScreenUnreadable = 'screen_unreadable';
    case NeedsAttention = 'needs_attention';
    case NavigationNeeded = 'navigation_needed';

    /**
     * Whether only a user can clear the hold: a screen the driver shows that the journal never answers alone.
     */
    public function needsAUser(): bool
    {
        return match ($this) {
            self::PermissionRequired, self::TrustRequired, self::OnboardingRequired, self::LoginRequired,
            self::UpdateRequired, self::UnknownScreen, self::ScreenUnreadable, self::NeedsAttention,
            self::NavigationNeeded => true,
            self::None,
            self::Interrupted,
            self::Compacting,
            self::UserInput,
            self::DriverInput,
            self::UsageLimited => false,
        };
    }

    /**
     * Whether the driver waits at a menu only its user can answer in its terminal: folder trust or first-run setup.
     */
    public function needsAttentionInDriver(): bool
    {
        return in_array($this, [
            self::TrustRequired,
            self::OnboardingRequired,
        ], true);
    }
}
