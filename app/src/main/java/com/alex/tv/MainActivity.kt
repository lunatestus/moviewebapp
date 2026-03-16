package com.alex.tv

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.KeyEvent
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var bridge: TvBridge

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Fullscreen immersive
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true

            // Disable scrollbars — our web UI handles its own scrolling
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false

            // Performance tweaks
            setLayerType(LAYER_TYPE_HARDWARE, null)

            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
        }

        // Set up the JS ↔ Native bridge
        bridge = TvBridge(this)
        webView.addJavascriptInterface(bridge, "NativeBridge")

        setContentView(webView)

        // Load the web UI from assets
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // Let the WebView handle D-pad keys natively — they map to arrow key events
        // Only intercept keys the WebView shouldn't get
        return when (keyCode) {
            // Let WebView handle all D-pad and media keys
            KeyEvent.KEYCODE_DPAD_UP,
            KeyEvent.KEYCODE_DPAD_DOWN,
            KeyEvent.KEYCODE_DPAD_LEFT,
            KeyEvent.KEYCODE_DPAD_RIGHT,
            KeyEvent.KEYCODE_DPAD_CENTER,
            KeyEvent.KEYCODE_ENTER,
            KeyEvent.KEYCODE_MEDIA_PLAY,
            KeyEvent.KEYCODE_MEDIA_PAUSE,
            KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE -> {
                // Forward as key event to webview — D-pad maps to arrow keys in WebView
                webView.dispatchKeyEvent(event!!)
                true
            }
            KeyEvent.KEYCODE_BACK -> {
                // Send Escape to the web UI
                webView.evaluateJavascript(
                    "document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))",
                    null
                )
                true
            }
            else -> super.onKeyDown(keyCode, event)
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        // Notify the web UI that we're back (e.g., from the player)
        webView.evaluateJavascript("if(window.onNativeResume) onNativeResume()", null)
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
