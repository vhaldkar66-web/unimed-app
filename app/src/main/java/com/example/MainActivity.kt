package com.example

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
          WebAppWebView(modifier = Modifier.padding(innerPadding))
        }
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebAppWebView(modifier: Modifier = Modifier) {
  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { context ->
      WebView(context).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.userAgentString = settings.userAgentString.replace("; wv", "")

        val assetLoader = WebViewAssetLoader.Builder()
          .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
          .build()
        webChromeClient = object : android.webkit.WebChromeClient() {
          override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage): Boolean {
            android.util.Log.d("WebViewConsole", "${consoleMessage.message()} -- From line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()}")
            return true
          }
        }
        webViewClient = object : WebViewClient() {
          override fun shouldInterceptRequest(
            view: WebView,
            request: WebResourceRequest
          ): WebResourceResponse? {
            return assetLoader.shouldInterceptRequest(request.url)
          }
        }
        
        loadUrl("https://appassets.androidplatform.net/assets/index.html")
      }
    },
    update = { webView ->
      // Nothing needed on update
    }
  )
}
